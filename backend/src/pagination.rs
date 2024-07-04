use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Pagination {
    pub page: usize,
    pub size: usize,
}

impl Default for Pagination {
    fn default() -> Self {
        Self { page: 1, size: 25 }
    }
}
