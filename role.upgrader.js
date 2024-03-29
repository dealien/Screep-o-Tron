var config = require('config');
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                if (config.visualizer.showCreepPaths == true) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                } else {
                    creep.moveTo(creep.room.controller);
                }
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            sources = _.sortBy(sources, s => creep.pos.getRangeTo(s)); // Harvest from the closest source

            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                if (config.visualizer.showCreepPaths == true) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                } else {
                    creep.moveTo(sources[0]);
                }
            }
        }
    }
};

module.exports = roleUpgrader;