#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate oauth2;
extern crate rocket;
use rocket::http::RawStr;

#[get("/")]
fn index() -> &'static str {
    "I'm the index! Respect me!"
}

#[get("/")]
fn test() -> &'static str {
    "Hello, test me!"
}

#[get("/")]
fn hello_unknown() -> &'static str {
    "Hello... you."
}

#[get("/<name>")]
fn hello(name: &RawStr) -> String {
    if name == "master" {
        format!("Master, you're back!")
    } else {
        format!("Hello, {}!", name)
    }
}

fn main() {
    rocket::ignite()
        .mount("/", routes![index])
        .mount("/test", routes![test])
        .mount("/hello", routes![hello, hello_unknown])
        .launch();
}
