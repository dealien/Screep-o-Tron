var config = require('config');

function travelTo(creep, source) {
    if (config.visualizer.showCreepPaths == true) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    } else {
        creep.moveTo(source);
    }
}

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            // If no source destination is set, set one
            if (Game.getObjectById(creep.memory.source) != null) {
                var source = Game.getObjectById(creep.memory.source);
            } else {
                var sources = creep.room.find(FIND_SOURCES);
                var source = sources[Math.floor(Math.random() * sources.length)];
                console.log('Setting source for ' + creep.name + ' to ' + source.id);
                creep.memory.source = source.id;
            }

            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                travelTo(creep, source);
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    travelTo(creep,targets[0])
                }
            }
        }
    }
};

module.exports = roleHarvester;