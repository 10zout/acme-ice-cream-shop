DROP TABLE IF EXISTS flavors;

CREATE TABLE flavors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
