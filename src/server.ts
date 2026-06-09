import { PORT } from './config/config.js';
import {app,} from './routes/app.js';



app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
    
})