let db = firebase.firestore()

window.addEventListener('DOMContentLoaded', async function(event) {
  // Step 1: Accept input from the "new post" form and write 
  // post data to Firestore. For best results, use square images
  // from Unsplash, e.g. https://unsplash.com/s/photos/tacos?orientation=squarish
  // Right-click and "copy image address"
  // - Begin by using .querySelector to select the form
  //   element, add an event listener to the 'submit' event,
  //   and preventing the default behavior.
  document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault()
    console.log('Post submitted!')
      
  // - Using the "db" variable, talk to Firestore. When the form is
  //   submitted, send the data entered to Firestore by using 
  //   db.collection('posts').add(). Along withthe username and image 
  //   URL, add a "likes" field and set it to 0; we'll use this later.
  // - Verify (in Firebase) that records are being added.

  // Before grabbing things from database, need to hit submit and add items
  // might need variables to hold form values
  let usernameText = document.querySelector('#username').value
  let imageURLText = document.querySelector('#image-url').value
  console.log(usernameText)
  console.log(imageURLText)

  if(usernameText.length && imageURLText.length > 0) {
    let addPost = await db.collection('posts').add({
      username: usernameText,
      url: imageURLText,
      likes: 0
    })

    document.querySelector('#username').value = ''
    document.querySelector('#image-url').value = ''
  }
  // Step 2: Read existing posts from Firestore and display them
  // when the page is loaded
  // - Read data using db.collection('posts').get()
  // - Loop through the returned data and set four variables 
  //   inside the loop – the post ID, the post data, the post
  //   username, and the post image URL
  // - Inside the loop, using insertAdjacentHTML, add posts
  //   to the page inside the provided "posts" div; sample code
  //   provided:

  let querySnapshot = await db.collection('posts').get()
  querySnapshot.size // => 3
  console.log(querySnapshot.size)

  let posts = querySnapshot.docs

  for (let i=0; i<posts.length; i++){
    let postID = posts[i].id 
    let postData = posts[i].data()
    let postUsername = postData.username
    let postImageUrl = postData.url 
    let postNumberOfLikes = postData.likes

    console.log(postUsername)
    console.log(postImageUrl)



    document.querySelector('.posts').insertAdjacentHTML('beforeend', `
      <div class="md:mt-16 mt-8 space-y-8">
        <div class="md:mx-0 mx-4">
          <span class="font-bold text-xl">${postUsername}</span>
        </div>
  
        <div>
          <img src="${postImageUrl}" class="w-full">
        </div>
   
        <div class="text-3xl md:mx-0 mx-4">
          <button class="${postID}">❤️</button>
          <span class="likes">${postNumberOfLikes}</span>
        </div>
      </div>
    `)

    document.querySelector(`.posts-${postID} .like-button`).addEventListener('click', async function(event) {
      event.preventDefault()
      console.log(`Post ${postID} was liked!`)
      let existingNumberOfLikes = document.querySelector(`.posts-${postID} .likes`).innerHTML
      let newNumberOfLikes = parseInt(existingNumberOfLikes) + 1
      document.querySelector(`.posts-${postID} .likes`).innerHTML = newNumberOfLikes
      await db.collection('posts').doc(postID).update({
        likes: newNumberOfLikes
      })
  })
  
  }

  
  // Step 3: Implement the "like" button
  // - In the code we wrote for Step 2, attach an event listener to
  //   every "like-button".
  // - HINT: simply doing document.querySelector('.like-button').addEventListener(...)
  //   is not enough. We must uniquely identify each like button by changing
  //   the class name or adding another class name to the parent.
  // - Ensure that each like button click is unique and has the post ID attached by
  //   writing out the post ID to the JavaScript console, e.g. 
  //   "post abcdefgwxyz like button clicked!"
  // - Increment the number of likes for each post in the HTML:
  //
  // // Get the existing number of likes from the "likes" element
  // let existingNumberOfLikes = document.querySelector(`.post-${postId} .likes`).innerHTML
  // // Increment the number of likes (converting to an Integer first) by 1
  // let newNumberOfLikes = parseInt(existingNumberOfLikes) + 1
  // document.querySelector(`.post-${postId} .likes`).innerHTML = newNumberOfLikes
  //
  // - Increment the number of likes for the given post in Firestore,
  //   using .update() – see "Common Use-Cases: Timestamp and Incrementing Values"
  //   in the reference.

  // Bonus:
  // - Add a new post and notice how it doesn't update the page until
  //   refresh. How would we get it to update right away? Hint: it's
  //   pretty much a copy-and-paste (or extracting some of our code
  //   to a function)
  // - When adding a new post and refreshing the page, the new post
  //   gets added in what seems to be a somewhat "random" order (but 
  //   it's the same "random" order every time we refresh). Why is that?
  //   How can we remedy? (HINT: involves a timestamp – see reference)
})

})
