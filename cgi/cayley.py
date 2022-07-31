#!/usr/bin/python3

import sys
import re

def generatePermutation(store, a, n):

	if n==1:
		store.append(stringA(a))
		return;
		
	for i in range(n):
		generatePermutation(store, a,  n-1)
		
		if n%2==1:
			temp = a[0]
			a[0]=a[n-1]
			a[n-1]=temp
		else:
			temp = a[i]
			a[i]=a[n-1]
			a[n-1]=temp
			

def printArray(a):
	for i in a:
		print(i,  end=" ")
	print()
		
def stringA(a):
	s=""
	for i in a:
		s=s+str(i)
	return s
	
def numberA(l):
	l2 = []
	for i in l:
		l2.append(eval(i))
	return l2

def cayleyTable(set):
	table = []
	for i in range(len(set)):
		table.append([applyHumanity(compositionOfMappings(set[i],set[j])) for j in range(len(set))])
	return table;

def print_2D_Data(set,data):
	print("<table id=\"_2d\">")
	print("<tr>\n<th id=\"operator\">o</th>")
	for h in range(len(set)):
		if h==0:
			print("<th class=\"heads\" id=\""+str(0)+"_"+str(h+1)+"\">I</th>")
		else:
			print("<th class=\"heads\" id=\""+str(0)+"_"+str(h+1)+"\">"+set[h]+"</th>")
	print("</tr>")
	idx = 0

	print("<tr>")
	for a in data:
		if idx==0:
			print("<th class=\"heads\" id=\""+str(idx+1)+"_"+str(0)+"\">I</th>")
		else:
			print("<th class=\"heads\" id=\""+str(idx+1)+"_"+str(0)+"\">"+set[idx]+"</th>")
		for b in range(len(a)):
			print("<td class=\"data\" id=\""+str(idx+1)+"_"+str(b+1)+"\">"+a[b]+"</td>")
		print("</tr>")
		idx+=1
	print("</table>")

def printLine(n,w):
	for i in range(n+1):
		print("+".ljust(w+2,"-"),end="")
	print("+")
		

def compositionOfMappings(f, g):
		lst = [numberA(list(i)) for i in re.split('[()]',f+g) if i !='']
		
		c = []
		done = []
		for i in range(4):
			cycl =[i+1]
			E = i+1

			if E in UnionN(c):
				continue

			while True:
				for cycle in lst[::-1]:
					if E in cycle:
						if E == cycle[-1]:
							E = cycle[0]
						else:
							E = cycle[cycle.index(E)+1]
				if cycl[0] == E:
					break
				cycl.append(E)
			c.append(cycl)
		return c

def applyHumanity(list_2D):
	s = ""
	for q in list_2D:
		if len(q)==1:
			continue
		else:
			s=s+"("+"".join(stringA(q))+")"
	if(len(s)==0):
		return 'I'
	return s

def Union(A,B):
	for p in B:
		if p not in A:
			A.append(p)
	return A

def Intersection(A, B):
	I = []
	for p in B:
		if p in A:
			I.append(p)
	return I

def UnionN(Multi_Set):
	store = []
	for set in Multi_Set:
		for element in set:
			if element not in store:
				store.append(element)
	return store


def compose(x1, y1,  index):
	x = [h for h in range(1,len(x1)+1)]
	y = {}
	for i in range(len(x)):
		y[str(x[i])] = y1[i]

	c = []
	done = []
	k = 1;

	while k not in done:
		cycle = [k,y[str(k)]]
		done.append(k)
		
		k = y[str(k)]

		while k in x:
			done.append(k)
			if y[str(k)] not in cycle:
				cycle.append(y[str(k)])
				
			#if y[str(k)] in x:
				#x.remove(y[str(k)])
			if k in x:
				x.remove(k)
				k = y[str(k)]
				done.append(k)
		if len(x)>0:
			k = min(x);

		c.append(cycle)

	return c

	
def check(q, R):
	return q in R

def checkNumPurity(A):
	print(A);
	for a in A:
		if a != len(A)+1:
			return True
	return False

def stepWiseCycleComputation(matrix, lst, mat):
	store = []
	l = [r for r in range(1,len(lst)+1)]
	for i in range(len(matrix)):
	#	print(l)
	#	print(numberA(mat[i]))
		fx = compose(lst, numberA(mat[i]), i+1)
		store.append(fx)
		#print(fx)
		#print()

	return store

def computeProperAnnotation(level,c,lt):
	l = []
	if level != 0:
		l.append("".join(["("+str(i)+")" for i in lt]))

	for g in c:
		s=""
		for q in g:
			if len(q)==2 and q[0]==q[1]:
				if level==0:
					s = s+"("+str(q[0])+")"
			else:
				s = s+"("+"".join(stringA(q))+")"
		if len(s)>0:
			l.append(s)
	return l

def getSymmetricSet(set, n):
	return ",".join([q for q in set])

def computeA(set):
	return [c for c in set.split(',') if c.count("(")%2==0 or c=="I" or len(c)%2==1]

N = int(sys.argv[1])

if N:
	matrix = []
	mylist = [i for i in range(1,N+1)]
	generatePermutation(matrix, mylist, len(mylist))

	cycles = stepWiseCycleComputation(matrix, mylist, matrix)

	S = computeProperAnnotation(1,cycles,mylist)
	table = cayleyTable(S)
	print_2D_Data(S,table)

else:
	print("<p>The N field is a required field</p>")