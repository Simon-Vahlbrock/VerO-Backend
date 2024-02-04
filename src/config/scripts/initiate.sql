create table if not exists vero_db.roles
(
    id       int auto_increment
    primary key,
    roleName varchar(255) not null,
    constraint roleName_unique
    unique (roleName)
    );

create table if not exists vero_db.users
(
    userName    varchar(50)  not null
    primary key,
    firstName   varchar(50)  not null,
    lastName    varchar(50)  not null,
    address     varchar(255) not null,
    city        varchar(255) not null,
    zipCode     varchar(50)  not null,
    email       varchar(255) null,
    phoneNumber varchar(50)  null,
    birthDate   varchar(50)  null,
    status      int          not null,
    gender      int          not null
    );

create table if not exists vero_db.passwords
(
    userName  varchar(255)                        not null
    primary key,
    password  varchar(255)                        not null,
    salt      varchar(255)                        not null,
    createdAt timestamp default CURRENT_TIMESTAMP null,
    updatedAt timestamp default CURRENT_TIMESTAMP null,
    constraint passwords_ibfk_1
    foreign key (userName) references vero_db.users (userName)
    );

create table if not exists vero_db.user_roles
(
    userName varchar(255) not null,
    roleId   int          not null,
    primary key (userName, roleId),
    constraint user_roles_ibfk_1
    foreign key (userName) references vero_db.users (userName),
    constraint user_roles_ibfk_2
    foreign key (roleId) references vero_db.roles (id)
    );

create index roleId
    on vero_db.user_roles (roleId);

create table if not exists vero_db.user_tokens
(
    id            int auto_increment
    primary key,
    userName      varchar(50)  not null,
    userTokenId   varchar(255) not null,
    issuerTokenId varchar(255) null,
    constraint refreshTokenId
    unique (userTokenId),
    constraint user_tokens_ibfk_1
    foreign key (userName) references vero_db.users (userName)
    on delete cascade
    );

create index refreshTokenId_2
    on vero_db.user_tokens (userTokenId);

create index userName
    on vero_db.user_tokens (userName);

