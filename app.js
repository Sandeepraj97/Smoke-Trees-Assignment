
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(bodyParser.json());  

// Database setup (using Sequelize for MySQL)
const sequelize = new Sequelize('mydatabase', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

// Define User model
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Define Address model
const Address = sequelize.define('Address', {
    address: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Define relationships (User has many Addresses)
Address.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Address, { foreignKey: 'userId' });

// Sync models to create tables
sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => console.log('Error syncing database:', err));

// API Endpoint: POST /register
app.post('/register', async (req, res) => {
    const { name, address } = req.body;

    try {
        // Create a new User
        const user = await User.create({ name });
        
        // Create a new Address associated with the User
        const userAddress = await Address.create({
            address,
            userId: user.id  // Set the foreign key to link the User and Address
        });

        res.status(201).json({ message: 'User and address created successfully!', user, userAddress });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user or address' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
