cd src/routes
for filename in *; do
  if [[ -d "$filename" ]]; then 
    lower_filename=$(echo "$filename".html | tr '[:upper:]' '[:lower:]')
    cp ../../public/index.html ../../public/"$lower_filename"
  fi
done
