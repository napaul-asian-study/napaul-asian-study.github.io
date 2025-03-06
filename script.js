const topicsData = [{
    "title": "Asian Country",
    "header": "Exploring the Wonders of the Philippines",
    "iframeLink": "https://www.youtube.com/embed/_lsIr6MYTH8"
 },
 {
    "title": "Population",
    "header": "Exploring the People and Culture of the Philippines",
    "iframeLink": "https://www.youtube.com/embed/WCruZ6jns5Q"
 },
 {
    "title": "Languages and Dialects",
    "header": "Exploring the Languages of the Philippines",
    "iframeLink": "https://www.youtube.com/embed/Fa0PT-9wExA"
 },
 {
    "title": "Cultural Festivals",
    "header": "Exploring the Festivals of the Philippines",
    "iframeLink": "https://www.youtube.com/embed/ygsofRqEUAQ"
 },
 {
    "title": "Local Entertainment",
    "header": "Exploring the Entertainment Scene in the Philippines",
    "iframeLink": "https://www.youtube.com/embed/b2lOuvEMc9s"
 },
 {
    "title": "Personality",
    "header": "Exploring the Filipino Spirit and Identity",
    "iframeLink": "https://www.youtube.com/embed/ZhhJiD5u9qs"
 },
 {
    "title": "Traditional Sports",
    "header": "Exploring Traditional Sports in the Philippines",
    "iframeLink": "https://www.youtube.com/embed/3LLzW_fbApY"
 },
 {
    "title": "Communication",
    "header": "Exploring the Most Used App in the Philippines",
    "iframeLink": "https://www.youtube.com/embed/GXJw06c-eNI"
 },
 {
    "title": "Environment",
    "header": "Exploring Environmental Challenges in the Philippines",
    "iframeLink": "https://www.youtube.com/embed/9tfLnvYtxyE"
 },
 {
    "title": "Political Leadership",
    "header": "Exploring the Political Landscape of the Philippines",
    "iframeLink": "https://www.youtube.com/embed/4yZPRPyac1c"
 },
 {
    "title": "Asian Beauty",
    "header": "Exploring Beauty Standards in the Philippines",
    "iframeLink": "https://www.youtube.com/embed/_XqwzSN6y0c"
 },
 {
    "title": "Health and Wellness",
    "header": "Exploring Health and Wellness in the Philippines",
    "iframeLink": "https://www.youtube.com/embed/foD_cupwI1I"
 }
];
const closeButton = document.querySelector('.close');
const track = document.getElementById('image-track');
const container = document.getElementById('container');
const leftSection = document.getElementById('left-section');
const contentSection = document.getElementById('content-section');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const topicTitle = document.querySelector('.topics');
const topicHeader = document.querySelector('.header');
const topicParagraph = document.querySelector('.paragraph');
const iframe = document.querySelector('.content-box iframe');
let currentIndex = 0;
// Clone topics for infinite effect
const cloneElements = () => {
 const images = [...track.children];
 images.forEach(img => {
    const clone = img.cloneNode(true);
    track.appendChild(clone);
 });
};
cloneElements();
const images = track.querySelectorAll('.image');
images.forEach(img => {
 img.addEventListener('mouseenter', () => {
    img.classList.add('active');
    images.forEach(otherImg => {
       if (otherImg !== img) otherImg.classList.add('blurred');
    });
 });
 img.addEventListener('mouseleave', () => {
    img.classList.remove('active');
    images.forEach(otherImg => {
       otherImg.classList.remove('blurred');
    });
 });
});
images.forEach((img, index) => {
 const container = document.createElement('div');
 container.classList.add('image-container');
 const title = document.createElement('div');
 title.classList.add('image-title');
 title.textContent = topicsData[index % topicsData.length].title; // Ensure correct titles for clones
 img.parentNode.insertBefore(container, img);
 container.appendChild(img);
 container.appendChild(title);
});

function updateContent(index) {
 const data = topicsData[index % topicsData.length];
 topicTitle.textContent = data.title;
 topicHeader.textContent = data.header;
 iframe.src = data.iframeLink;
 fetch('assets/routes/paragraphs.html')
    .then(response => response.text())
    .then(html => {
       const parser = new DOMParser();
       const doc = parser.parseFromString(html, 'text/html');
       const paragraph = doc.getElementById(`paragraph-${index % topicsData.length}`).innerHTML;
       topicParagraph.innerHTML = paragraph;
    });
 // Update background image
 const selectedImage = track.querySelectorAll('.image')[index].src;
 leftSection.style.backgroundImage = `url('${selectedImage}')`;
}
// Click event for images
track.querySelectorAll('.image').forEach((img, index) => {
 img.addEventListener('click', () => {
    currentIndex = index % topicsData.length;
    leftSection.style.backgroundImage = `url('${img.src}')`;
    container.classList.add('active');
    updateContent(index);
 });
});
closeButton.addEventListener('click', () => {
 container.classList.remove('active');
 updateContent(null); // Fade out the container
});
prevBtn.addEventListener('click', () => {
 currentIndex = (currentIndex - 1 + topicsData.length) % topicsData.length;
 updateContent(currentIndex);
});
nextBtn.addEventListener('click', () => {
 currentIndex = (currentIndex + 1) % topicsData.length;
 updateContent(currentIndex);
});
// Infinite scrolling logic
const handleOnDown = e => {
 track.dataset.mouseDownAt = e.clientX;
 track.style.transition = 'none'; // Disable transition during drag
};
const handleOnUp = () => {
 track.dataset.mouseDownAt = '0';
 track.dataset.prevPercentage = track.dataset.percentage;
 track.style.transition = 'transform 0.5s ease'; // Re-enable transition after drag with a smoother effect
};
const handleOnMove = e => {
 if (track.dataset.mouseDownAt === '0') return;
 const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
 const maxDelta = window.innerWidth / 2;
 const percentage = (mouseDelta / maxDelta) * -50; // Reduce the percentage change for smoother sliding
 let nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage;
 // Infinite loop effect by resetting the percentage
 if (nextPercentageUnconstrained < -100) {
    nextPercentageUnconstrained += 100;
 } else if (nextPercentageUnconstrained > 0) {
    nextPercentageUnconstrained -= 100;
 }
 track.dataset.percentage = nextPercentageUnconstrained;
 track.style.transform = `translate(${nextPercentageUnconstrained}%, -50%)`;
 for (const image of track.getElementsByClassName('image')) {
    image.style.objectPosition = `${100 + nextPercentageUnconstrained}% center`;
 }
};
window.onmousedown = e => handleOnDown(e);
window.ontouchstart = e => handleOnDown(e.touches[0]);
window.onmouseup = e => handleOnUp(e);
window.ontouchend = e => handleOnUp(e.touches[0]);
window.onmousemove = e => handleOnMove(e);
window.ontouchmove = e => handleOnMove(e.touches[0]);