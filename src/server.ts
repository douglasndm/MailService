import App from './app';

App.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}`);
});
