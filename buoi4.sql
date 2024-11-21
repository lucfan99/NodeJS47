-- tạo user
CREATE USER 'EKK'@'%' IDENTIFIED BY "123456";

--cấp quyền (full quyền như root admin)
GRANT ALL PRIVILEGES ON node47.* TO 'EKK'@'%';
GRANT select  ON node47.* TO 'EKK'@'%';
GRANT insert  ON node47.* TO 'EKK'@'%';
-- REVOKE quyền cho account ekk
REVOKE ALL PRIVILEGES ON node47.* FROM 'ekk'@'%';

FLUSH PRIVILEGES;-- HÀM THỰC THI CẤP QUYỀN HAY THU HỒI QUYỀN
--show quyền user
SHOW GRANTS FOR 'EKK'@'%';

--xóa user
DROP USER 'EKK'@'%';
FLUSH privileges 

--các quyền có trong SQL
-- ALL PRIVILAGES : FULL quyền 
-- + quyền trên table :
	-- select
	-- insert 
	-- update
	-- delete 
-- + quyền trên database
	-- DROP
	-- ALTER 
	-- CREATE
	-- INDEX

-- show những connection tới database
SHOW PROCESSLIST

-- kill session
-- kill <session_id>

--tạo procedure
DELIMITER //
CREATE PROCEDURE remove_user()
BEGIN
--DEFINE tất cả logic trong đây
		update users
		set full_name =" áda"
		where user_id=1;
END //
DELIMITER

drop procedure remove_user
-- TẠO TABLE MỚI
