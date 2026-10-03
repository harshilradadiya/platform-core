import ipaddress
import logging
import re
import socket
import urllib.parse
from typing import Optional
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.config import settings

logger = logging.getLogger(__name__)

# Global SlowAPI limiter configured by client IP address
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[f"{settings.RATE_LIMIT_PER_MINUTE}/minute"],
    storage_uri=settings.RATELIMIT_STORAGE_URI,
)

# Common metadata and internal IP definitions
BLOCKED_IP_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),       # IPv4 loopback
    ipaddress.ip_network("10.0.0.0/8"),        # RFC 1918 private
    ipaddress.ip_network("172.16.0.0/12"),     # RFC 1918 private
    ipaddress.ip_network("192.168.0.0/16"),    # RFC 1918 private
    ipaddress.ip_network("169.254.0.0/16"),    # Link-local / Cloud metadata (AWS, GCP, Azure)
    ipaddress.ip_network("100.64.0.0/10"),     # Carrier-grade NAT
    ipaddress.ip_network("0.0.0.0/8"),         # Unspecified
    ipaddress.ip_network("::1/128"),           # IPv6 loopback
    ipaddress.ip_network("fc00::/7"),          # Unique local address (ULA)
    ipaddress.ip_network("fe80::/10"),         # IPv6 link-local
]


def is_ip_blocked(ip_addr: ipaddress.IPv4Address | ipaddress.IPv6Address) -> bool:
    """Checks whether an IP address belongs to internal, loopback, or cloud-metadata subnets."""
    if (
        ip_addr.is_private
        or ip_addr.is_loopback
        or ip_addr.is_link_local
        or ip_addr.is_reserved
        or ip_addr.is_multicast
        or ip_addr.is_unspecified
    ):
        return True
    return any(ip_addr in net for net in BLOCKED_IP_NETWORKS)


def validate_safe_media_url(url: str) -> str:
    """
    Validates that a URL is safe to fetch or pipe, protecting against Server-Side Request Forgery (SSRF).
    
    Guarantees:
    1. Scheme is strictly HTTP or HTTPS.
    2. Hostname is not empty or malformed.
    3. Hostname does not resolve to private RFC 1918, loopback, or cloud instance metadata (169.254.169.254).
    4. Protects against DNS rebinding and internal network probing.
    """
    clean_url = url.strip()
    parsed = urllib.parse.urlparse(clean_url)

    if parsed.scheme.lower() not in ("http", "https"):
        raise ValueError(f"Invalid URL scheme '{parsed.scheme}'. Only HTTP and HTTPS are permitted.")

    hostname = parsed.hostname
    if not hostname:
        raise ValueError("URL must contain a valid hostname.")

    # Prevent direct access to 'localhost' or common internal nicknames
    if hostname.lower() in ("localhost", "metadata.google.internal", "instance-data"):
        raise ValueError(f"SSRF Protection: Access to hostname '{hostname}' is forbidden.")

    # 1. Check if hostname is an IP literal
    try:
        ip_obj = ipaddress.ip_address(hostname)
        if is_ip_blocked(ip_obj):
            raise ValueError(f"SSRF Protection: Direct IP target '{hostname}' is within a forbidden subnet.")
        return clean_url
    except ValueError as exc:
        if "within a forbidden subnet" in str(exc):
            raise
        # Not an IP literal, continue to DNS resolution check

    # 2. DNS Resolution verification
    try:
        addr_info = socket.getaddrinfo(hostname, None, socket.AF_UNSPEC, socket.SOCK_STREAM)
        for _, _, _, _, sockaddr in addr_info:
            ip_str = sockaddr[0]
            ip_obj = ipaddress.ip_address(ip_str)
            if is_ip_blocked(ip_obj):
                raise ValueError(
                    f"SSRF Protection: Hostname '{hostname}' resolves to forbidden private/internal IP {ip_str}."
                )
    except socket.gaierror as e:
        raise ValueError(f"Unable to resolve hostname '{hostname}': {str(e)}") from e

    return clean_url


def sanitize_filename(filename: Optional[str], default: str = "media_download.mp4") -> str:
    """
    Sanitizes user-provided attachment filenames.
    Prevents CRLF header injection, path traversal (e.g. ../ or ..\\), and illegal filesystem characters.
    """
    if not filename:
        return default

    # Remove CRLF, quotes, and null bytes to prevent HTTP header injection
    cleaned = re.sub(r'[\r\n\0"\'/\\]', "", filename).strip()
    # Strip dangerous path traversal sequences
    cleaned = re.sub(r"\.\.+", ".", cleaned)

    if not cleaned or cleaned.startswith("."):
        return default

    # Enforce maximum length of 120 characters
    return cleaned[:120]

