extern crate base64;
extern crate oauth2;
extern crate rand;
extern crate url;

use oauth2::prelude::*;
use oauth2::{
    AuthorizationCode,
    AuthUrl,
    ClientId,
    ClientSecret,
    CsrfToken,
    RedirectUrl,
    Scope,
    TokenUrl
};
use oauth2::basic::BasicClient;
use url::Url;

// Create an OAuth2 client by specifying the client ID, client secret, authorization URL and
// token URL.
let client =
    BasicClient::new(
        ClientId::new("42fe5e70822f99659d85ab4289de9bac552ccf1ef22b014d16083f67b3271df4".to_string()),
        Some(ClientSecret::new("05b5544f19da473d4e0e6143d9a484c74bdff154efa34c6b8c37d84e6cd52935".to_string())),
        AuthUrl::new(Url::parse("https://api.intra.42.fr/oauth/authorize?client_id=42fe5e70822f99659d85ab4289de9bac552ccf1ef22b014d16083f67b3271df4&redirect_uri=https%3A%2F%2Fwww.google.com%2F&response_type=code")?),
        Some(TokenUrl::new(Url::parse("https://api.intra.42.fr")?))
    )
        // Set the desired scopes.
        .add_scope(Scope::new("public".to_string()))

        // Set the URL the user will be redirected to after the authorization process.
        .set_redirect_url(RedirectUrl::new(Url::parse("https://www.google.com")?));

// Now you can trade it for an access token.
let token_result = client.exchange_client_credentials();

// Unwrapping token_result will either produce a Token or a RequestTokenError.
