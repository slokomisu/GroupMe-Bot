
exports.up = function (knex, Promise) {
    return knex.schema.createTable('response_trigger', t => {
        t.increments('id').primary();
        t.string('triggerName').notNullable();
        t.string('triggerDescription').notNullable();
        t.string('triggerUseExample').notNullable();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('response_trigger');
};
