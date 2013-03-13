netjs.data.ConnectionState = (function (netjs) {

    var ConnectionState = netjs.Enumeration({

        // The connection is closed.
        Closed: 'Closed',

        // The connection is open.
        Open: 'Open',

        // The connection object is connecting to the data source.
        Connecting: 'Connecting',

        // The connection object is executing a command. (This value is reserved for future versions of the product.)
        Executing: 'Executing',

        // The connection object is retrieving data. (This value is reserved for future versions of the product.)
        Fetching: 'Fetching',

        // The connection to the data source is broken. This can occur only after the connection has been opened.
        // A connection in this state may be closed and then re-opened.
        // (This value is reserved for future versions of the product.)
        Broken: 'Broken'
    });

    return ConnectionState;
} (netjs));