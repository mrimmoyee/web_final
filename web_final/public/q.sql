CREATE OR REPLACE PROCEDURE prime_generator ( s IN NUMBER ) IS
 prime_sum NUMBER := 0;
 prime_candidate NUMBER := 2;
 is_prime BOOLEAN ;

 -- Function to check if a number is prime
 FUNCTION is_prime_number ( n IN NUMBER ) RETURN BOOLEAN IS
 i NUMBER ;
 BEGIN
 IF n < 2 THEN
 RETURN FALSE ;
 END IF ;

 FOR i IN 2.. FLOOR ( SQRT ( n ) ) LOOP
 IF n MOD i = 0 THEN
 RETURN FALSE ;
 END IF ;
 END LOOP ;

 RETURN TRUE ;
 END;

 BEGIN
 DBMS_OUTPUT . PUT_LINE (’Prime numbers :’) ;

 -- Continue generating primes while sum <= s
 WHILE prime_sum + prime_candidate <= s LOOP

 -- Check if the current candidate is prime
 IF is_prime_number ( prime_candidate ) THEN
 -- Print the prime number
 DBMS_OUTPUT . PUT_LINE ( prime_candidate ) ;
 -- Add the prime number to the sum
 prime_sum := prime_sum + prime_candidate ;
 END IF ;

 -- Move to the next number
 prime_candidate := prime_candidate + 1;
 END LOOP ;

 -- Print the sum of prime numbers
 DBMS_OUTPUT . PUT_LINE (’Total sum: ’ || prime_sum ) ;
 END ;
 /

 BEGIN
 prime_generator (20) ;
 END ;
 /

 connect system/noshin
 CREATE USER LAB122 IDENTIFIED BY noshin;
 GRANT ALL PRIVILEGES TO LAB122;
 connect LAB122/noshin;


CREATE TABLE student (
 student_id NUMBER PRIMARY KEY ,
 student_name VARCHAR2 (50) ,
 attendance NUMBER (5 ,2) ,
 quiz NUMBER (5 ,2) ,
 mid_term NUMBER (5 ,2) ,
 final_exam NUMBER (5 ,2)
 ) ;

INSERT INTO student ( student_id , student_name , attendance ,
quiz , mid_term , final_exam ) VALUES
 (202 , ’Rohan ’, 9.5 , 13 , 21 , 42) ,
 (216 , ’Nabila ’, 10 , 14 , 24 , 45) ,
 (241 , ’Nuha ’, 8 , 11 , 19 , 38) ,
 (254 , ’Buku ’, 9 , 12 , 22 , 41) ,
 (248 , ’Tanjil ’, 7.5 , 10 , 18 , 35) ;

 CREATE OR REPLACE PROCEDURE calculate_total_marks (
p_student_id IN NUMBER ) IS
 attendance_weighted NUMBER ;
 quiz_weighted NUMBER ;
 mid_term_weighted NUMBER ;
 final_exam_weighted NUMBER ;
 total_marks NUMBER ;
 BEGIN
 -- Fetching and calculating the weighted marks for the

 SELECT ( attendance * 0.10) , ( quiz * 0.15) , ( mid_term *
0.25) , ( final_exam * 0.50)
 INTO attendance_weighted , quiz_weighted ,
mid_term_weighted , final_exam_weighted
 FROM student
 WHERE student_id = p_student_id ;

 -- Summing up the total marks
 total_marks := attendance_weighted + quiz_weighted +
mid_term_weighted + final_exam_weighted ;

 -- Output the total marks
 DBMS_OUTPUT . PUT_LINE (’Total marks for student ID ’ ||
p_student_id || ’ is: ’ || total_marks ) ;
 END ;
 /
