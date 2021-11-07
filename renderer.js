const fs = require('fs');
const ytdl = require('ytdl-core');
const scdl = require('soundcloud-downloader').default
const scrape = require('website-scraper');


//only one input field at the top
const videoUrl = document.getElementById('videoUrl');
//input field for website downloader
const websiteDir = document.getElementById('website-dir');

//buttons
const youtube_btn = document.getElementById('youtube-btn');
const soundcloud_btn = document.getElementById('soundcloud-btn');
const website_btn = document.getElementById('website-btn');

//listeners
youtube_btn.onclick = (() => onYoutubeClick())
soundcloud_btn.onclick = (() => onSoundCloudClick())
website_btn.onclick = (() => onWebsiteClick())

//debug
videoUrl.value = 'https://www.youtube.com/watch?v=G9Otw12OUvE&t=19s'


//download entire website
async function onWebsiteClick() {

    const options = {
        urls: [videoUrl.value],
        directory: websiteDir.value
    };
      
    // with async/await
    const result = await scrape(options);
      
    // with promise
    scrape(options).then((result) => {});

    
}

//download soundcloud soundtrack with scdl
async function onSoundCloudClick() {

    let videoTitle = replaceIllegalChars( (await scdl.getInfo(videoUrl.value)).title )
    let stream = scdl.download(videoUrl.value).then(stream => stream.pipe(fs.createWriteStream(videoTitle + '.mp3')));
    
    //because scdl is very fast PolarDownloader doesn't need to notify the user if it has started/ended
    new Notification('Polar Downloader', { body: `Started download of "${videoTitle}"\nThe download should be finished in a few seconds.`});
}


//download youtube video with ytdl core
async function onYoutubeClick() {

    const videoInfo = await ytdl.getInfo(videoUrl.value)
    const videoTitle = replaceIllegalChars(videoInfo.videoDetails.title)


    let stream = ytdl(videoUrl.value).pipe(fs.createWriteStream(videoTitle + '.mp4'));

    stream.on('finish', (chunk) => {
        new Notification('Polar Downloader', { body: `Ended download of "${videoTitle}"`});
    });
    stream.on('ready', (chunk) => {
        new Notification('Polar Downloader', { body: `Started download of "${videoTitle}"`});
    });
    stream.on('error', (err) => {
        new Notification('Polar Downloader', { body: `Error downloading "${videoTitle}" ! See the console.`});
        console.log('PolarError: ' + err);
    })

}


//replaces illegal chars for file names
function replaceIllegalChars(str) {
    illegal = ['>', '/', '<', ':', '"', '\\', '|', '*', '?']

    for(ch in illegal) {
        str = str.replace(illegal[ch], ' ')
    }
    return str;
}
