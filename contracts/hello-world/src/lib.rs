#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, Symbol, Vec, String};

#[contracttype]
#[derive(Clone)]
pub struct Question {
    pub id: u32,
    pub question: String,
    pub answer: String,
}

#[contract]
pub struct QuizContract;

#[contractimpl]
impl QuizContract {

    // Add a new quiz question
    pub fn add_question(env: Env, id: u32, question: String, answer: String) {
        let q = Question { id, question, answer };
        env.storage().instance().set(&id, &q);
    }

    // Get a quiz question
    pub fn get_question(env: Env, id: u32) -> Question {
        env.storage()
            .instance()
            .get(&id)
            .unwrap()
    }

    // Verify answer
    pub fn check_answer(env: Env, id: u32, user_answer: String) -> bool {
        let q: Question = env.storage().instance().get(&id).unwrap();
        q.answer == user_answer
    }
}