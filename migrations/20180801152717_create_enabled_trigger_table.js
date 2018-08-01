
exports.up = function(knex, Promise) {
  return knex.schema.createTable('enabled_triggers', t => {
      t.increments('id').primary();
      t.integer('triggerId').unsigned().references('id').inTable('response_trigger').notNullable();
      t.integer('botId').unsigned().references('id').inTable('bot').notNullable()
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('enabled_triggers');
};
