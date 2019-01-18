counter=1
while [ $counter -le 50 ]
  do
    sed -i '' s/[0-9][0-9]*/$counter/g ./load.cql
    # cat ./load.cql
    cqlsh -f ./load.cql
  ((counter++))
done