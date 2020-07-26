git pull

if [ "$1" = "--install" ]
    then
        npm install
        cd client
        npm install
        cd ..
fi

cd client

npm run build

cd ..

rm -rf ./public/app
mkdir ./public/app
mv ./client/build/* ./public/app