// Factory for EventListener objects. This module contains a Notifier object
// that can be used to manage a list of listener functions to be triggered when
// an event occurs in a system component.
var EventListener = (function() {
  // Create a new instance of a notifier chain. A notifier chain is used
  // to activate a queue of listener functions when an asynchornous event
  // occurs.
  var Notifier = function Notifier() {
    if (!(this instanceof Notifier)) {
      return new Notifier();
    }

    this.listeners = [];
    this.listenerCount = 0;
  };

  // Notifier function to iterate over each registered function and apply
  // a given function to the registered function
  Notifier.prototype.each = function notifierEach(yieldFunc) {
    var listener = null;

    for (listener in this.listeners) {
      if (!this.listeners.hasOwnProperty(listener)) {
        continue;
      }

      // Call the yield function 
      yieldFunc(this.listeners[listener], listener);
    }

  };

  // Notify a set of listeners with the given object.
  Notifier.prototype.notifyEvent = function notifierNotifyEvent(object) {
    this.each(function (handler) {
      handler(object);
    });
  };

  // Add a listener with the specified identifier to the given Notifier
  // chain.
  // Listeners are functions that take a single argument which is an object
  // containing information on the pdate that occurred and is triggering
  // the notification.
  //
  // \param id the ID of the listener (used for later reference)
  // \param listenerFunc The function to be dispatched on the given event
  // \return true on successfully adding to the queue, false otherwise
  Notifier.prototype.addListener = function notifierAddListener(id, listenerFunc) {
    if (this.listeners.hasOwnProperty(id)) {
      return false;
    }

    this.listeners[id] = listenerFunc;
    this.listenerCount++;

    return true;
  };

  // Remove the specifed listener, by ID
  // \param id The ID of the listener to be removed
  // \return true on successful removal, false otherwise
  Notifier.prototype.rmListener = function notifierRmListener(id) {
    if (!this.listeners.hasOwnProperty(id)) {
      return false;
    }

    delete this.listeners[id];
    this.listenerCount--;

    return true;
  };

  // Return the count of subscribers to this event queue
  Notifier.prototype.getListenerCount = function countListeners() {
    return this.listenerCount;
  };

  var iface = {};

  iface.newNotifier = function newNotifier() {
    return new Notifier();
  };

  return iface;

}());
