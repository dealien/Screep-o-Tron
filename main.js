var config = require('config');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');


module.exports.loop = function () {

    // Only run every 5 ticks
    if (Game.time % 5 === 0) {
        var harvesterTarget = 2;
        var upgraderTarget = 2;
        var builderTarget = 1;

        // Count how many creeps exist with the various roles
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

        // If fewer creeps exist than the role target, spawn a new creep
        if (harvesters.length < harvesterTarget) {
            var newName = 'Harvester' + Game.time;
            console.log('Under harvester target: ' + harvesters.length.toString() + '/' + harvesterTarget.toString());
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {memory: {role: 'harvester'}});
        }
        if (upgraders.length < upgraderTarget) {
            var newName = 'Upgrader' + Game.time;
            console.log('Under upgrader target: ' + upgraders.length.toString() + '/' + upgraderTarget.toString());
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {memory: {role: 'upgrader'}});
        }
        if (builders.length < builderTarget) {
            var newName = 'Builder' + Game.time;
            console.log('Under builder target: ' + builders.length.toString() + '/' + builderTarget.toString());
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {memory: {role: 'builder'}});
        }
    }

    // TODO: Consider moving this to a separate visualization module
    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}