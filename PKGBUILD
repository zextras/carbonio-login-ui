# Zextras Login Page
# This package contains the assets for the browser login page

targets=(
  "centos"
  "ubuntu"
)
pkgname="zextras-login"
pkgver="0.9.0"
pkgrel="1"
pkgdesc="Zextras login page assets"
pkgdesclong=(
  "Zextras login page assets"
)
maintainer="Zextras <packages@zextras.com>"
arch="amd64"
license=("PROPRIETARY")
section="admin"
priority="optional"
url="https://www.zextras.com/"
depends=(
  "zextras-nginx"
)

build() {
}

preinst() {
}

package() {
  cd "${srcdir}"
  mkdir -p "${pkgdir}/opt/zextras/web/login/"
  cp -a  ../build/* "${pkgdir}/opt/zextras/web/login"
  chown root:root -R "${pkgdir}/opt/zextras/web/login"
  chmod 755 -R "${pkgdir}/opt/zextras/web/login"
}

postinst() {
}

prerm() {
}

postrm() {
}