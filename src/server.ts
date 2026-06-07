
import {app,PORT} from './routes/app.js';

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
    
})