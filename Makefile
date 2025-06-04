all:
	yarn install

clean:
	rm yarn.lock

fclean: clean
	rm -rf .expo node_modules "$(TMPDIR)/metro-cache"

re: fclean all

.PHONY: all clean fclean re
