const express = require('express')

const app = express()
const port = 5000

app.set('view engine', 'hbs') // set view engine hbs
app.use('/assets', express.static(__dirname + '/assets')) // path folder assets
app.use(express.urlencoded({ extended: false }))


let isLogin = true
let dataBlog = []

app.get('/', function (request, response) {
    // console.log(dataBlog);

    let data = dataBlog.map(function (item) {
        return {
            ...item,
            isLogin,
            postAt: getFullTime(item.postAt),
            duration: getDistanceTime(item.postAt)
        }
    })

    response.render('index', { isLogin, blog: data })
})

app.get('/contact', function (request, response) {
    response.render('contact')
})



app.get('/blog-detail/:index', function (request, response) {
    let index = request.params.index

    let data = dataBlog[index]
    data = {
        title: data.title,
        content: data.content,
        stardate: data.stardate,
        enddate: data.enddate,
        author: data.author,
        postAt: getFullTime(data.postAt)
    }

    response.render('blog-detail', { data })
})

app.get("/myproject", function (request, response) {
    response.render("myproject");
});


app.post('/myproject', function (request, response) {
    // console.log(request.body);

    let title = request.body.inputTitle
    let content = request.body.inputContent
    let stardate = request.body.inputStardate
    let enddate = request.body.inputEnddate



    let blog = {
        title,
        stardate,
        enddate,
        content,
        postAt: new Date(),
        author: "Adam Ramadhan",
    }

    dataBlog.push(blog)

    response.redirect('/')
})

app.get('/update-blog/:index', function (request, response) {
    let index = request.params.index

    let data = {
        title: dataBlog[index].title,
        content: dataBlog[index].content,
        stardate: dataBlog[index].stardate,
        enddate: dataBlog[index].enddate
    }

    response.render('update-blog', { index, data })
})

app.post('/update-blog/:index', function (request, response) {

    let index = request.params.index

    dataBlog[index].title = request.body.inputTitle
    dataBlog[index].content = request.body.inputContent
    dataBlog[index].stardate = request.body.inputStardate
    dataBlog[index].enddate = request.body.inputEnddate

    response.redirect('/')
})

app.get('/delete-blog/:index', function (request, response) {
    // console.log(request.params);
    let index = request.params.index
    // console.log(index);
    dataBlog.splice(index, 1)

    response.redirect('/')
})


function getFullTime(time) {

    let month = ["Januari", "Febuari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "Nopember", "Desember"]

    let date = time.getDate()
    let monthIndex = time.getMonth()
    let year = time.getFullYear()

    let hours = time.getHours()
    let minutes = time.getMinutes()

    if (hours < 10) {
        hours = "0" + hours
    } else if (minutes < 10) {
        minutes = "0" + minutes
    }

    // 12 Agustus 2022 09.04
    let fullTime = `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`
    // console.log(fullTime);
    return fullTime
}

function getDistanceTime(time) {

    let timeNow = new Date()
    let timePost = time

    let distance = timeNow - timePost
    // console.log(distance);

    let milisecond = 1000 // 1 detik 1000 milisecond
    let secondInHours = 3600 // 1 jam sama dengan 3600 detik
    let hoursInDay = 24 // 1 hari 24 jam

    let distanceDay = Math.floor(distance / (milisecond * secondInHours * hoursInDay))
    let distanceHours = Math.floor(distance / (milisecond * 60 * 60))
    let distanceMinutes = Math.floor(distance / (milisecond * 60))
    let distanceSeconds = Math.floor(distance / milisecond)

    if (distanceDay > 0) {
        return `${distanceDay} day ago`
    } else if (distanceHours > 0) {
        return `${distanceHours} hours ago`
    } else if (distanceMinutes > 0) {
        return `${distanceMinutes} minutes ago`
    } else {
        return `${distanceSeconds} seconds ago`
    }
}

app.listen(port, function () {
    console.log(`server running on port ${port}`);
})