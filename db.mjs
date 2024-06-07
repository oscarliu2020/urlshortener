import pg from 'pg';
import { v1 as uuid } from 'uuid';

const DBPATH = process.env.DBPATH;
const pool=new pg.Pool({
    connectionString:DBPATH,
});
const schema=`CREATE TABLE IF NOT EXISTS url (
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


    return  pool.query(query);
    
}
async function get(nanoid){
    const query={
        text:'SELECT * FROM url WHERE nanoid=$1',
        values:[nanoid]
    }
    return pool.query(query);
}
async function list(){
    const query={
        text:'SELECT * FROM url',
    };
    return pool.query(query);
}
// export
export{insert,get,list};