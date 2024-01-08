# sql

> 数据库

## 数据库

- 数据库是一种存储数据的仓库，它是由一组相关的数据组成的集合。
- 数据库管理系统（DBMS）是管理数据库的软件，它允许用户在数据库中创建、查询、更新和删除数据。
- 数据库管理系统（DBMS）是管理数据库的软件，它允许用户在数据库中创建、查询、更新和删除数据。

## SQL 进阶用法

```sql
CREATE TABLE movies (
id INT PRIMARY KEY AUTO_INCREMENT,
movie_name VARCHAR(255),
actors VARCHAR(255),
price DECIMAL(10,2) DEFAULT 50,
release date DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO movies(movie_name,actors,price,release_date) VALUES 
('咱们结婚吧','新东',43.2,'2013-04-12'),
('四大名捕','刘亦菲',62.5,'2013-12-21'),
('猎场','新东',68.5,'2017-11-03'),
('芳华','范冰冰',55.0,'2017-09-15'),
('功夫瑜伽','成龙',91.8,'2017-01-28'),
('惊天解密','新东',96.9,'2019-08-13'),
('铜雀台',null,65,'2025-12-16'),
('天下无贼','刘亦菲',44.9,'2004-12-16'),
('建国大业','范冰冰',70.5,'2009-09-21'),
('赛尔号4:疯狂机器城','范冰冰',58.9,'2021-07-30'),
('花木兰','刘亦菲',89.0,'2020-09-11'),
('警察故事','成龙',68.0,'1985-12-14'),
('神话','成龙'.86.5.'2005-12-22');
```

1. 自定义排序 ORDER BY FIElD

    ```sql
    select * from movies order by movie_name asc;
    
    select * from movies order by FIELD(movie_name,'神话','猎场','芳华','花木兰','铜雀台','警察故事','天下无贼','四大名捕','惊天解密','建国大业','功夫瑜伽','咱们结婚吧','赛尔号4','疯狂机器城');
    ```

2. 空值 NULL 排序 ORDER BY IF(ISNULL)
    在MySQL中使用ORDERBY关键字加上我们需要排序的字段名称就可以完成该字段的排序。如果字段中存在NULL值就会对我们的排序结果造成影响,
    这时候我们可以使用ORDERBYIF(ISNULL(字段),0,1)语法将NULL值转换成0或1,实现NUL值数据排序到数据集前面还是后面。

