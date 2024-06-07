import express from 'express';
// const {nanoid}=require('nanoid');
import { nanoid } from 'nanoid';
import { insert ,get,list} from './db.mjs';
const app=express();
const DBPATH=process.env.DBPATH;

app.use(express.json());
app.post('/api/shorturl',(req,res)=>{
    const url=req.body.url;
    if(!url){
        res.status(400).send('URL is required');
        return;
    }
    const shorturl=`${req.protocol}://${req.get('host')}/r/${nanoid(10)}`;
    const shortid=nanoid(10);
    if (!DBPATH) {
        console.log("test environment");
        console.log(`URL: ${url} ShortURL: ${shorturl}`);
    } else {
        try {
            insert(url,shortid);
        } catch (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
        }
    }
    res.status(201).json({shorturl});
});
app.get('/r/:shortid',(req,res)=>{
    const shortid=req.params.shortid;
    if (!DBPATH) {
        console.log(`ShortID: ${shortid}`);
    } else {
        get(shortid).then((result)=>{
            if (result.rows.length>0) {
                res.redirect(result.rows[0].url);
                return;
            }
            res.status(404).send('Not found');
        }).catch((err)=>{
            console.log(err);
            res.status(500).send('Internal server error');
        });
    }
    // res.status(404).send('Not found');
});
app.get('/api/list',(req,res)=>{
    if (!DBPATH) {
        console.log('List');
        res.json([]);
        return;
    }
    list().then((result)=>{
        res.json(result.rows);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send('Internal server error');
    });
})
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});