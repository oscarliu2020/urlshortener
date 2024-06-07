import pg from 'pg';
import { v1 as uuid } from 'uuid';

const DBPATH = process.env.DBPATH;
const pool=new pg.Pool({
    connectionString:DBPATH,
});
const schema=`CREATE TABLE url (
    uuid UUID NOT NULL,
    nanoid TEXT NOT NULL,
    url TEXT NOT NULL,
    createdate TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (uuid, nanoid)
);`;
try {
    pool.query(schema);
}
catch (err) {
    console.log(err);
}

async function insert(url,nanoid){
    const newuuid=uuid();
    const query={
        text:'INSERT INTO url (uuid,nanoid,url) VALUES ($1,$2,$3)',
        values:[newuuid,nanoid,url],
    };
    let res;
    try {

        res= await pool.query(query);
    } catch (err) {
        console.log(err);
    }
    return res;
}
async function get(nanoid){
    const query={
        text:'SELECT * FROM url WHERE nanoid=$1',
        values:[nanoid]
    }
    let res;
    try {
        res= await pool.query(query);
    }catch (err) {
        console.log(err);
    }
    return res;
}
async function list(){
    const query={
        text:'SELECT * FROM url',
    };
    let res;
    try {
        res= await pool.query(query);
    }
    catch (err) {
        console.log(err);
    }
    return res.fields;
}
// export
export{insert,get,list};