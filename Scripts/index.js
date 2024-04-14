if('serviceWorker' in navigator)
{
    navigator.serviceWorker.register('/serviceWorker.js', {scope: '/'})
    .then((registration)=>{
        // console.log('Registraion Scope: ', registration.scope)
        
    })
    .catch((err)=>{
        // console.log('Error during registration : ', err)
    })
}

