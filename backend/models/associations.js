const Hotel       = require('./Hotel');
const Chambre     = require('./Chambre');
const Reservation = require('./Reservation');
const Client      = require('./Client');

Hotel.hasMany(Chambre,       { foreignKey: 'hotel_id',   as: 'chambres'     });
Chambre.belongsTo(Hotel,     { foreignKey: 'hotel_id',   as: 'hotel'        });

Hotel.hasMany(Reservation,   { foreignKey: 'hotel_id',   as: 'reservations' });
Reservation.belongsTo(Hotel, { foreignKey: 'hotel_id',   as: 'hotel'        });

Chambre.hasMany(Reservation,   { foreignKey: 'chambre_id', as: 'reservations' });
Reservation.belongsTo(Chambre, { foreignKey: 'chambre_id', as: 'chambre'      });

Client.hasMany(Reservation,    { foreignKey: 'client_id',  as: 'reservations' });
Reservation.belongsTo(Client,  { foreignKey: 'client_id',  as: 'client'       });