for filename in src/routes/*; do
  if [[ -d "$filename" ]]; then 
    lower_filename=$(echo "$filename".html | tr '[:upper]' '[:lower]')
    cp public/index.html public/"$lower_filename"
  fi
done
