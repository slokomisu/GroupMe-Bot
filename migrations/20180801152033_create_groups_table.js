
exports.up = function(knex, Promise) {
  return knex.schema.createTable('group', t => {
      t.integer('id').primary();
      t.string('groupName').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('group');
};
