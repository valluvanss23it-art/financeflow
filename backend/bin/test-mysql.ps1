# PowerShell script to test MySQL connection via Node
node -e "require('../config/mysql').testConnection().then(()=>{console.log('MySQL OK');process.exit(0)}).catch(err=>{console.error('MySQL ERROR', err.message||err);process.exit(1)})"
