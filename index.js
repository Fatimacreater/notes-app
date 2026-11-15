const express = require('express');
const app = express();
const path = require('path');
const fs = require("fs");
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req, res) => {

    fs.readdir('./file', (err, files) => {

        if (err) return res.send(err);

        let allFiles = [];

        files.forEach(element => {

            const description = fs.readFileSync(
                `./file/${element}`,
                'utf-8'
            );
            
            allFiles.push({
                title: element,
                description: description
            });

        });

        res.render("index", { file: allFiles });
    });
});


app.post("/create", (req, res) => {

    let { title, description } = req.body;

    title = title.trim();
    description = description.trim();

    if (!title || !description) {
        return res.status(400).send("Title and description are required")
    }
    if (!/^[a-zA-Z0-9 _-]+$/.test(title)) {
    return res.status(400).send("Invalid filename");
    }

    fs.writeFile(`./file/${title}.txt`,description,(err)=>{
        if (err) {
             return res.status(500).send(err);
        }
        res.redirect("/")
    })
    
});


//delete feature
app.post('/delete/:filename' , (req,res)=>{
    let {filename} = req.params;
    fs.unlink(`./file/${filename}` , (err)=>{
        if (err) {
            return res.send(err.message);
        }
        res.redirect('/');
    })

})

//edit feature
app.get('/edit/:filename', (req,res)=>{
    let {filename} = req.params;
    let description = fs.readFileSync(`./file/${filename}`,"utf-8")
    res.render('edit',{filename,description})
})
app.post('/edit' , (req,res)=>{
    let {title,description} = req.body
    fs.writeFile(`./file/${title}`,description,(err)=>{
        if (err) {
            return res.send(err.message)
        }
    } )
    res.redirect('/');
    
})

//read more feature
app.get('/read/:filename',(req,res)=>{
    let {filename} = req.params
    
    let description = fs.readFileSync(`./file/${filename}`,"utf-8");
    res.render('read',{filename,description})
})
app.listen(3000,()=>{
    console.log("server start");   
});