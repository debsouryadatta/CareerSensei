from fastapi import Request, HTTPException
from jose import jwt
from jose.exceptions import JWTError
import requests
from typing import Optional
from core.config import settings

# Auth0/Okta configuration
DOMAIN = settings.auth0_domain
AUDIENCE = settings.auth0_audience
ALGORITHMS = ["RS256"]
ISSUER = f"https://{DOMAIN}/"

def get_token_jwks():
    jwks_url = f"https://{DOMAIN}/.well-known/jwks.json"
    return requests.get(jwks_url).json()

def validate_token(request: Request) -> Optional[dict]:
    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")
    
    token = token.split("Bearer ")[1]
    try:
        jwks = get_token_jwks()
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break

        if not rsa_key:
            raise HTTPException(status_code=401, detail="Unable to find appropriate key")

        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=ALGORITHMS,
            audience=AUDIENCE,
            issuer=ISSUER
        )
        return payload

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

