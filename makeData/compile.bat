docker build -t ignatandrei/wfh .. -f ./compile.txt  
docker run -d --name wfh  ignatandrei/wfh
docker cp wfh:/usr/src/obj/all.md .
docker container kill wfh
docker container rm wfh