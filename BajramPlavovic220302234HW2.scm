

(define (sum-list lst)
  (if (null? lst)
      0
      (+ (car lst) (sum-list (cdr lst)))))

(define (length-list lst)
  (if (null? lst)
      0
      (+ 1 (length-list (cdr lst)))))

(define (max-list lst)
  (if (null? (cdr lst))
      (car lst)
      (let ((rest-max (max-list (cdr lst))))
        (if (> (car lst) rest-max)
            (car lst)
            rest-max))))

(define (count-passing lst)
  (if (null? lst)
      0
      (+ (if (>= (car lst) 60) 1 0)
         (count-passing (cdr lst)))))



(define (grade-report grades)
  (let* ((total (sum-list grades))
         (count (length-list grades))
         (average (quotient total count))
         (highest (max-list grades))
         (passing (count-passing grades)))
    (list average highest passing)))


(define (update-distribution grade dist)
  (cond
    ((>= grade 90)
     (cons (+ 1 (car dist)) (cdr dist)))
    ((>= grade 80)
     (cons (car dist)
           (cons (+ 1 (cadr dist)) (cddr dist))))
    ((>= grade 70)
     (list (car dist) (cadr dist)
           (+ 1 (caddr dist))
           (cadddr dist)
           (car (cddddr dist))))
    ((>= grade 60)
     (list (car dist) (cadr dist) (caddr dist)
           (+ 1 (cadddr dist))
           (car (cddddr dist))))
    (else
     (list (car dist) (cadr dist) (caddr dist)
           (cadddr dist)
           (+ 1 (car (cddddr dist)))))))

(define (distribution-helper grades dist)
  (if (null? grades)
      dist
      (distribution-helper
       (cdr grades)
       (update-distribution (car grades) dist))))

(define (grade-distribution grades)
  (distribution-helper grades '(0 0 0 0 0)))


(define (student-status grades)
  (let* ((total (sum-list grades))
         (count (length-list grades))
         (average (quotient total count)))
    (cond
      ((>= average 85) 'excellent)
      ((>= average 70) 'good)
      ((>= average 60) 'pass)
      (else 'fail))))

;; student grades should be defined 
(define student-grades '(80 90 90 90 90 90 90 90 80 100 100 100 100))



(display (grade-report student-grades)) ;;drops grade report
(newline)

(display (grade-distribution student-grades)) ;;displays grade distribution
(newline)

(display (student-status student-grades)) ;;average
(newline)
