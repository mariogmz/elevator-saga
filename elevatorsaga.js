{
  init: function(elevators, floors) {
    var requestsByFloor = {};
    elevators.forEach(function (elevator, index) {
      requestsByFloor[index] = floors.map(function (floor) {
        return 0;
      });
    });
    
    function getMostRequestedFloor(elevator) {
      if (requestsByFloor[elevator].length === 0) { return -1; }

      var max = requestsByFloor[elevator][0];
      var maxIndex = 0;

      for (var i = 1; i < requestsByFloor[elevator].length; i++) {
          if (requestsByFloor[elevator][i] > max) {
              maxIndex = i;
              max = requestsByFloor[elevator][i];
          }
      }
      return maxIndex;
    }
    
    function cleanFloorRequests(elevator, floorNumber) {
      requestsByFloor[elevator][floorNumber] = 0;
    }
    
    function checkMoreFloors(elevator) {
      var isAtTopHalf = elevator.currentFloor() > floors.length % 2;
      elevator.destinationQueue = [];
      if(isAtTopHalf) {
        for(var i = elevator.currentFloor(); i > 0; i--) {
          elevator.destinationQueue.push(i);
        }
      } else {
        for(var i = 0; i < elevator.currentFloor(); i++) {
          elevator.destinationQueue.push(i);
        }
      }
      elevator.checkDestinationQueue();
    }

    // Whenever the elevator is idle (has no more queued destinations) ...
    elevators.forEach(function (elevator, elevatorIndex) {

      elevator.on("idle", function() {
        if(elevator.loadFactor() > 0.0) {
          console.log('Most Requested for Elevator' + elevatorIndex + ' is ' + getMostRequestedFloor(elevatorIndex))
          elevator.goToFloor(getMostRequestedFloor(elevatorIndex));
        } else {
          checkMoreFloors(elevator);
        }
      });
      
      elevator.on('floor_button_pressed', function (floorNum) {
        if(elevator.currentFloor() !== floorNum) {
          requestsByFloor[elevatorIndex][floorNum]++;
          
          var mostRequestedFloor = getMostRequestedFloor(elevatorIndex);
          elevator.goToFloor(mostRequestedFloor);
          cleanFloorRequests(elevatorIndex, mostRequestedFloor);
        }

      });
    });
    
    
  },
  update: function(dt, elevators, floors) {
    // We normally don't need to do anything here
  }
}