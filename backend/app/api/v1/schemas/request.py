from pydantic import BaseModel, Field, HttpUrl, field_validator


class ResolveRequest(BaseModel):
    url: str = Field(..., description="Target media URL to resolve", min_length=5, max_length=2048)

    @field_validator("url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        clean_url = v.strip()
        if not (clean_url.startswith("http://") or clean_url.startswith("https://")):
            raise ValueError("URL must begin with http:// or https://")
        return clean_url
