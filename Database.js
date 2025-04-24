import mysql from 'mysql2/promise';

async function connectDB() {
    try {
        // Create the connection to database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Root@123',
            database: 'sms',
        });

        console.log('✅ MySQL Database Connected');
        return connection;
    } catch (error) {
        console.error('❌ Database Connection Failed:', error.message);
        process.exit(1); 
    }
}

// Export connection for reuse in other files
export default connectDB;
