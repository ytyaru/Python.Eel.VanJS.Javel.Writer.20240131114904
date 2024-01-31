[ja](./README.ja.md)

# Eel.VanJS.Javel.Writer

Create an app to write novels.

<!--

# DEMO

* [demo](https://ytyaru.github.io/Python.Eel.VanJS.Javel.Writer.20240131114904/)

![img](https://github.com/ytyaru/Python.Eel.VanJS.Javel.Writer.20240131114904/blob/master/doc/0.png?raw=true)

# Features

* sales point

-->

# Requirement

* <time datetime="2024-01-31T11:48:14+0900">2024-01-31</time>
* [Raspbierry Pi](https://ja.wikipedia.org/wiki/Raspberry_Pi) 4 Model B Rev 1.2
* [Raspberry Pi OS](https://ja.wikipedia.org/wiki/Raspbian) buster 10.0 2020-08-20 <small>[setup](http://ytyaru.hatenablog.com/entry/2020/10/06/111111)</small>
* bash 5.0.3(1)-release
* Python 3.10.5

<!-- * Python 2.7.16 -->

```sh
$ uname -a
Linux raspberrypi 5.10.103-v8+ #1529 SMP PREEMPT Tue Mar 8 12:26:46 GMT 2022 aarch64 GNU/Linux
```

# Installation

## anyenv

```sh
git clone https://github.com/anyenv/anyenv ~/.anyenv
echo 'export PATH="$HOME/.anyenv/bin:$PATH"' >> ~/.bash_profile
echo 'eval "$(anyenv init -)"' >> ~/.bash_profile
anyenv install --init -y
```

## pyenv

```sh
anyenv install pyenv
exec $SHELL -l
```

## python

```sh
sudo apt install -y libsqlite3-dev libbz2-dev libncurses5-dev libgdbm-dev liblzma-dev libssl-dev tcl-dev tk-dev libreadline-dev
```

```sh
pyenv install -l
```
```sh
pyenv install 3.10.5
```


## this works

```sh
git clone https://github.com/ytyaru/Python.Eel.VanJS.Javel.Writer.20240131114904
cd Python.Eel.VanJS.Javel.Writer.20240131114904/src
```

# Usage

## run

```sh
./run.py
```

## unit test

```sh
./test.py
```

<!--

# Note

* important point

-->

# Author

ytyaru

* [![github](http://www.google.com/s2/favicons?domain=github.com)](https://github.com/ytyaru "github")
* [![hatena](http://www.google.com/s2/favicons?domain=www.hatena.ne.jp)](http://ytyaru.hatenablog.com/ytyaru "hatena")
* [![twitter](http://www.google.com/s2/favicons?domain=twitter.com)](https://twitter.com/ytyaru1 "twitter")
* [![mastodon](http://www.google.com/s2/favicons?domain=mstdn.jp)](https://mstdn.jp/web/accounts/233143 "mastdon")

# License

This software is CC0 licensed.

[![CC0](http://i.creativecommons.org/p/zero/1.0/88x31.png "CC0")](http://creativecommons.org/publicdomain/zero/1.0/deed.en)

