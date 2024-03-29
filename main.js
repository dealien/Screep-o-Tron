var config = require('config');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');


module.exports.loop = function () {

    // Only run every 5 ticks
    if (Game.time % 5 === 0) {
        // Clear old creeps's data from memory
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        // Count how many creeps exist with the various roles
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

        // TODO: Make a queue to better control creep spawn order
        // If fewer creeps exist than the role target, spawn a new creep
        if (harvesters.length < config.roleTargets.harvesters) {
            var newName = 'Harvester' + Game.time;
            console.log('Under harvester target: ' + harvesters.length.toString() + '/' + config.roleTargets.harvesters.toString());
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {memory: {role: 'harvester'}});
        }
        if (upgraders.length < config.roleTargets.upgraders) {
            var newName = 'Upgrader' + Game.time;
            console.log('Under upgrader target: ' + upgraders.length.toString() + '/' + config.roleTargets.upgraders.toString());
            if (!Game.spawns['Spawn1'].spawning) { // Don't attempt to spawn if the spawner is busy
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {memory: {role: 'upgrader'}});
            }
        }
        if (builders.length < config.roleTargets.builders) {
            var newName = 'Builder' + Game.time;
            console.log('Under builder target: ' + builders.length.toString() + '/' + config.roleTargets.builders.toString());
            if (!Game.spawns['Spawn1'].spawning) { // Don't attempt to spawn if the spawner is busy
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {memory: {role: 'builder'}});
            }
        }
    }

    // TODO: Consider moving this to a separate visualization or spawner module
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