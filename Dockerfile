# cài môi trường nodejs để chạy source BE
FROM node:20

#Tạo thư mục tên là app
WORKDIR /home/app
# copy file package.json và package-lock.json và thư mục app
COPY package*.json ./
#Cài thư viện trong file package.json
RUN yarn install
#Copy prisma từ local sang docker
#vừa copy và tạo folder /prisma
COPY prisma ./prisma/

# tạo prisma client
RUN npx prisma generate
#copy toàn bộ source code vào thư mục app
# . đàu tiên: copy tất cả những file và folder cùng cấp với dockerfile
#. thứ 2 ''; folder app mới tạo ở trên 
COPY . .

# expose port 8080
EXPOSE 8081
# chạy source : npm start
CMD ["yarn","run","start"]





# build docker image
# . : đường dẫn tới Dockerfile
# -t : tên image
# docker build . -t node47

# port 1: port2
# port 1: port dùng để bên ngoài kết nối tới container
# port2 : port cứng của container
# docker run -d -p 880:8081 -- name node47_container node47
