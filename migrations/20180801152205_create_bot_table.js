
exports.up = function(knex, Promise) {
    return knex.schema.createTable('bot', t => {
        t.increments('id').primary();
        t.string('name').notNullable();
        t.string('callbackUrl').notNullable();
        t.string('avatarUrl');
        t.integer('groupId').references('id').inTable('group').notNull().onDelete('cascade');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('bot');
};
