CREATE TYPE STATUS AS ENUM (
    'active',
    'deleted'
);

CREATE TYPE PLATFORM_USER_STATUS AS ENUM (
    'pendingActivation',
    'active',
    'deleted'
);

CREATE TABLE platform_users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email_address VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    status PLATFORM_USER_STATUS NOT NULL DEFAULT 'pendingActivation',
    created_by VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by VARCHAR,
    updated_at TIMESTAMP
);
