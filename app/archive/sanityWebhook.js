import { exec } from 'child_process';

export default (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  // You can add security checks here

  exec('sudo npm run build', (error, stdout, stderr) => {
    if (error) {
       console.error(`Build error: ${error}`);
       return res.status(500).json({ error: 'Build failed.' });
    }
    exec('sudo pm2 restart ur-website', (error, stdout, stderr) => {
       if (error) {
          console.error(`PM2 restart error: ${error}`);
          return res.status(500).json({ error: 'PM2 restart failed.' });
       }
       res.status(200).json({ success: true });
    });
 });
 
};
