from pydantic import BaseModel, ConfigDict, Field


class LoginRequest(BaseModel):
    email: str
    password: str


class AdminUserOut(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    email: str
    full_name: str | None = Field(default=None, serialization_alias="fullName")


class LoginResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    access_token: str = Field(serialization_alias="accessToken")
    token_type: str = Field(default="bearer", serialization_alias="tokenType")
    expires_in: int = Field(serialization_alias="expiresIn")
    user: AdminUserOut
