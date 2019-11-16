var config = require('config');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        // Update room sign
        if (creep.room.controller.sign.text != config.sign) {
            creep.say('✏ sign');
            creep.memory.sign = true;
        } else {
            creep.memory.sign = false;
        }

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building && !creep.memory.sign) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            // TODO: If no build target is found, act as upgrader to prevent blocking sources
            if (targets.length) { // If there are objects waiting to be built, build them
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    if (config.visualizer.showCreepPaths == true) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    } else {
                        creep.moveTo(targets[0]);
                    }
                }
            } else { // If no build target is found, act as upgrader
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    if (config.visualizer.showCreepPaths == true) {
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                    } else {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        } else if (creep.memory.sign) {
            if (creep.signController(creep.room.controller, config.sign) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
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

module.exports = roleBuilder;